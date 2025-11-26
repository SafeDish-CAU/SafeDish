import React, {createContext, useContext, useState}  from 'react';
import {AllergyList, Allergy_NameToIdx} from './AllergyList';


//userData : 유저 정보를 Context를 통해 전역으로 관리하기 위함.
const UserContext = createContext();

export function UserDataProvider({children}){

    const [UserData, SetUserData] = useState({
        uid : 1,
        user_name : 'user',
        user_allergy : [3,4, 5, 15, 13, 19],
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


    return(
        <UserContext.Provider value={{UserData, UserNameSetter, AllergySetter}}>
            {children}
        </UserContext.Provider>
    );
}


export function useUserData(){
    const context = useContext(UserContext);
    return context;
}
