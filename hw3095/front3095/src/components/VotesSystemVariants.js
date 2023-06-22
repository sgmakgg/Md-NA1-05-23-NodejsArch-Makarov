import React, {Fragment, useState} from 'react';

const VotesSystemVariants = ({variants}) => {

    const[voteVariants, setVoteVariants] = useState(variants);

    let renderButtons = () => {
        if(voteVariants !== null){
            return [...voteVariants].map((item) => {
                return <input type='button' key={item.code} value={"Vote for:\xa0" + item.FIO}/>
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

export default VotesSystemVariants;