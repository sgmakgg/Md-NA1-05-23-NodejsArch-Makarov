import React, {Fragment} from 'react';

import {withDataLoad} from './withDataLoad';
import VotesSystemStat from "./VotesSystemStat";
import {requests} from "../requestConfigs/requests";
import VotesSystemVariants from "./VotesSystemVariants";

class VotesSystemPreloader extends React.PureComponent {

    VotesSystemStatWithData=withDataLoad(requests[0].resConfig, requests[0].propName)(VotesSystemStat);
    VotesSystemVariantsWithData=withDataLoad(requests[1].resConfig, requests[1].propName)(VotesSystemVariants);

    render() {

        let VotesSystemWithData=this.VotesSystemStatWithData;
        let VotesSystemVariantsWithData=this.VotesSystemVariantsWithData
        return <Fragment>
                    <VotesSystemWithData/>
                    <hr/>
                    <VotesSystemVariantsWithData/>
                </Fragment>;

    }

}

export default VotesSystemPreloader;
