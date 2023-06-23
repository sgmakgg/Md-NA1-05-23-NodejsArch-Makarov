import React, {Fragment} from 'react';

import {withDataLoad} from './withDataLoad';
import VotesSystemStat from "./VotesSystemStat";
import {requests} from "../requestConfigs/requests";
import VotesSystemVariants from "./VotesSystemVariants";
import {updateEvent, updateStatistic} from "../events/UpdateEvent";

class VotesSystemPreloader extends React.PureComponent {

    state ={
        VotesSystemStatWithData: null
    }

    componentDidMount() {
        updateEvent.addListener(updateStatistic, this.updateVotesSystemStatWithDataState);
        this.updateVotesSystemStatWithDataState();
    };

    componentWillUnmount() {
        updateEvent.removeListener(updateStatistic, this.updateVotesSystemStatWithDataState);
    }

    updateVotesSystemStatWithDataState = () =>{
        let res = this.updateStat();
        this.setState({VotesSystemStatWithData: res});
    }

    updateStat = () => {
        return withDataLoad(requests[0].resConfig, requests[0].propName)(VotesSystemStat);
    }

    VotesSystemStatWithData=this.updateStat();
    VotesSystemVariantsWithData=withDataLoad(requests[1].resConfig, requests[1].propName)(VotesSystemVariants);

    render() {

        let VotesSystemStatWithData=(this.state.VotesSystemStatWithData === null)
            ?
            this.VotesSystemStatWithData
            :
            this.state.VotesSystemStatWithData;

        let VotesSystemVariantsWithData=this.VotesSystemVariantsWithData;

        return <Fragment>
                    <VotesSystemStatWithData/>
                    <hr/>
                    <VotesSystemVariantsWithData/>
                </Fragment>;

    }
}

export default VotesSystemPreloader;
