import React, {Fragment, useState} from 'react';

const VotesSystemStat = ({stats}) => {
    const[statistic, setStatistic] = useState(stats);

    let renderCurrentStatistic = () => {
        return [...statistic].map((item) => {
            return <div key={item.code}>{item.FIO + "\xa0->\xa0" + item.votes + "\xa0vote(s)"}</div>
        });
    };

    return(
        <Fragment>
            <div className='Statistic'>
                <h3>{"Candidates:\xa0"}</h3>
                {renderCurrentStatistic()}
            </div>
        </Fragment>
    );
};

export default React.memo(VotesSystemStat);