import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const create = () => {

    const log = (error) => toast.error(error);   

    const catch_error = (error , inspect)=>{
        try {
            log(error.error.data.message)
            } catch{
                console.log(`${inspect} :: function ` , error)
            }
            try{
            log(error.message)
            }catch{
            console.log(`${inspect} :: function ` , error)
            }
    }
   
   
    return {
        catch_error , log
    };

};

const error = create();


export default error;