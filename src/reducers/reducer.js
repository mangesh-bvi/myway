const iState={
    userid:'ATA',
    username:'mk',
    lastLoginDate:'',
    displayAsShipper:'',
    userType:'',
    firstName:'',
    LastName:''
    
}
const reducer=(state=iState,action)=>{
    console.log(state);
    if(action.type==='ChangeName')
    {
        return{
            ...state,
            username:action.payload
        }
      
    }
 return state;
}

export default reducer;