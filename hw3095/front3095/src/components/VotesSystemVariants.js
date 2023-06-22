import React, {Fragment, useState} from 'react';
import {requests} from "../requestConfigs/requests";

const VotesSystemVariants = ({variants}) => {

    const[voteVariants, setVoteVariants] = useState(variants);

    async function sendData(EO){
        let request = requests[2].resConfig;
        request = {...request, body:JSON.stringify({code:EO.target.dataset.vote})}
        try {
            let response=await fetch(request.URL, request);
            if (!response.ok) {
                throw new Error("fetch error " + response.status);
            }

        }
        catch ( error )  {
            this.fetchError(error.message);
        }

    };

    let renderButtons = () => {
        if(voteVariants !== null){
            return [...voteVariants].map((item) => {
                return <input type='button'
                              key={item.code}
                              value={"Vote for:\xa0" + item.FIO}
                              data-vote={item.code}
                              onClick={sendData}/>
            });
        }
        return null;
    };

    return(
        <Fragment>
            <div className='ButtonsGroup'>
                <span>
                    {renderButtons()}
                </span>
            </div>
        </Fragment>
    );
};

export default React.memo(VotesSystemVariants);