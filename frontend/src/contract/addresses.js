minting: async ({ game_id, contract_id, token_id, user_id, amount }, { user }) => {
    try {

        const account = await DB.select('*')
            .from(`${AccountModel.table}`)
            .where('user_id', user_id)
            .first();

        if (!account) {
            return { code: HTTP.NotFound, error: Response.ErrorBody('No Wallet Created.', {}) }
        }

        const game = await DB.select('*')
            .from(`${GameModel.table}`)
            .where('id', game_id)
            .first();
        if (!game) {
            return { code: HTTP.NotFound, error: Response.ErrorBody('No Game Found.', {}) }
        }

        const gameContract = await DB.select('*')
            .from(`${NftContracts.table}`).where('id', contract_id).where('game_id', game_id).first();

        if (!gameContract) {
            return { code: HTTP.NotFound, error: Response.ErrorBody('No Contract Found.', {}) }
        }

        let abi = ERC721_CONTRACT;
        if (gameContract.contract_type === 'erc1155') {
            let check_amount = await getErc1155TotalSupply(gameContract.contract, game.public_address, token_id, gameContract.chain)
            if (+check_amount < +amount) {
                return { code: HTTP.BadRequest, error: Response.ErrorBody(`You do not have enough amount of this asset to transfer`, {}) }
            }
            abi = ERC1155_CONTRACT;
        }

        const { balance, chainInfo } = await userBalance(gameContract.chain, game.public_address);

        console.log(balance);

        // let gasfee = await estimateGas(chainInfo.chain);

        let gasLimit;

        const privateKey = decryption(game.private_address);

        const provider = new ethers.providers.JsonRpcProvider(chainInfo.node);

        const { gasPrice } = await provider.getFeeData();

        const wallet = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(gameContract.contract, abi, wallet);


        if (gameContract.contract_type === 'erc1155') {
            gasLimit = await contract.estimateGas["safeTransferFrom"](game.public_address, account.starz_wallet_address, token_id, amount, []);
        }
        else {
            gasLimit = await contract.estimateGas["safeTransferFrom(address,address,uint256)"](game.public_address, account.starz_wallet_address, token_id);
        }


        let gasfee = gasPrice.mul(gasLimit).toString();
        gasfee = +gasfee * 2;

        if (+balance < +gasfee) {
            return { code: HTTP.BadRequest, error: Response.ErrorBody(`You do not have enough gas fee for ${chainInfo.name} to transfer this asset `, {}) }
        }

        const exist = await DB.select('*').from(`${TransferAssetModel.table}`)
            .where("game_id", game_id)
            .where("contract_id", contract_id)
            .where('user_id', user_id)
            .where('user_account_id', account.id)
            .where("token_id", token_id).first();

        if (!exist) {
            await DB(`${TransferAssetModel.table}`).insert({
                user_id: user_id,
                game_id: game.id,
                contract_id: gameContract.id,
                token_id: token_id,
                user_account_id: account.id,
                amount: amount ? amount : 0,
                created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DDTHH:mm:ss')
            })
        }
        else {
            let amount_benji = amount ? +amount + exist.amount : 0;
            await DB(`${TransferAssetModel.table}`)
                .where('id', exist.id)
                .update({
                    amount: +amount_benji,
                    updated_at: moment().format('YYYY-MM-DDTHH:mm:ss')
                })
        }


        let result;

        if (gameContract.contract_type === 'erc1155') {
            const transaction = await contract["safeTransferFrom"](game.public_address, account.starz_wallet_address, token_id, amount, [], { gasPrice: gasPrice })
            result = await transaction.wait();
        }
        else {
            const transaction = await contract["safeTransferFrom(address,address,uint256)"](game.public_address, account.starz_wallet_address, token_id, { gasPrice: gasPrice })
            result = await transaction.wait();
        }
        const notification = await DB.select('*').from(`${NotificationModel.table}`).orderBy('order_by', 'desc').first()

        await DB(NotificationModel.table).insert({
            user_id: user_id,
            game_id,
            asset_id: token_id,
            type: 'asset-transfer',
            order_by: notification ? notification.order_by + 1 : 1,
            created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
        })

        return {
            code: HTTP.Success,
            body: result
        }

    } catch (err) {
        console.log(err);
        const exist = await DB.select('*').from(`${TransferAssetModel.table}`)
            .where("game_id", game_id)
            .where("contract_id", contract_id)
            .where('user_id', user_id)
            .where("token_id", token_id).first();
        if (!exist) {
            await DB(TransferAssetModel.table)
                .where("game_id", game_id)
                .where("contract_id", contract_id)
                .where('user_id', user_id)
                .where("token_id", token_id)
                .del()
        }
        else {
            await DB(`${TransferAssetModel.table}`)
                .where('id', exist.id)
                .update({
                    amount: +amount - exist.amount
                })
        }
        Logger.error('minting minting ', err)
        return {
            code: HTTP.ServerError,
            error: Response.ErrorBody('Something went wrong. Try again later.', err),
        }
    }
},