// action functions
const setToast = (props) => {
    const {type = 'error', message} = props;
    let customMessage = `Tizimda nomalum hatolik ro'y berdi! Tizim administratoriga murojaat qiling!`;
    if(type === 'success'){
        customMessage = `Muvaffaqiyatli!`
    }
    return {
        type: "toast",
        payload: {
            type: type,
            message: message ? message : customMessage
        }
    }
}
const setLoader = (loader)=>{
    return{
        type: 'loader',
        payload: loader
    }
}
export {
    setToast,
    setLoader
}