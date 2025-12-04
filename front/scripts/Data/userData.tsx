import React, {createContext, useContext, useState}  from 'react';
import {AllergyList, Allergy_NameToIdx} from './AllergyList';


//userData : 유저 정보를 Context를 통해 전역으로 관리하기 위함.
const UserContext = createContext();

export function UserDataProvider({children}){

    const [UserData, SetUserData] = useState({
        uid : 1,
        user_name : 'user',
        user_allergy : [3,4, 5, 15, 13, 19],
        user_cart : [],
        })

    // UserNameSetter : 유저이름세팅
    const UserNameSetter = ({value}) => {
        SetUserData(prev => ({
                    ...prev,
                    user_name: value,
                    }));
        }


    // allergySetter
    // param : mode: add or remove,
    // value : AllergyList에 있는 알러지 유발 물질에 해당하는 코드 중 1
    // or 이름으로 검색시 정확한 이름으로 써야함.
    const AllergySetter = ({mode, value}) =>{
        const result = [...UserData.user_allergy];
        let allergyVal = value;
        if(typeof(value) == 'string'){
            allergyVal = Allergy_NameToIdx[value];
        }

        console.log("allergySetter::", mode, allergyVal)
        if (mode == 'add'){
            if(UserData.user_allergy.includes(allergyVal)) {
                console.log ('UserDataError : allergyList already includes :: ', AllergyList[allergyVal]);
            } else result.push(allergyVal);
        }
        else{
            if(!UserData.user_allergy.includes(allergyVal)) {
                console.log ('UserDataError : allergyList already includes :: ', AllergyList[allergyVal]);
            } else {
                const idx = result.findIndex(item => item == allergyVal);
                result.splice(idx, 1);
            }
        }

        SetUserData(prev => ({
            ...prev,
            user_allergy:result,
            }));

    }
    /*
     :::   param   :::
     cartAdder에 들어가는 데이터 자료형

     {
         menu_id: int
         menu_name: string
         menu_price: int

         optionList: [
            {
             option_id: int,
             option_name: string,
             option_price: int
             }
         ]
     }

     -> 이 형태로 param을 받고, 바로 userCart에 들어감.
    */
    const CartAdder = ({menu}) =>{
        SetUserData(prev => ({
            ...prev,
            user_cart: [...prev.user_cart, menu]
        }));
        console.log(UserData.user_cart);
    }

    const RemoveFromCart=(index) =>{
        SetUserData(prev=>({
            ...prev,
            user_cart:[...prev.user_cart.slice(0,index),
                        ...prev.user_cart.slice(index+1)],
            }));
    }

    const RemoveAndRecommend=(index)=>{

        //TODO : RecommandSystem으로 데이터를 보냄

        RemoveFromCart(index)
        }


    const ResetCart=()=>{
        const len = UserData.user_cart.length;
        for (let i=0;i<len;i++){
        RemoveAndRecommend(i);
        }
    }

    return(
        <UserContext.Provider value={{UserData, UserNameSetter, AllergySetter, CartAdder}}>
            {children}
        </UserContext.Provider>
    );
}


export function useUserData(){
    const context = useContext(UserContext);
    return context;
}
