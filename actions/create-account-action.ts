"use server"


type ActionStateType = {
    errors: string[];
    success: string
}

export async function register(prevstate:ActionStateType,formData:FormData){
   
    const registerData={
        
    }
    return{
        errors:[],
        success:''
    }

}