class RateFlowFacade {

    constructor(rateFlow) {
        this.rateFlow = rateFlow;
    }

    setName(name) {
        this.rateFlow.name = name;
    }

    setCategory(category) {
        this.rateFlow.category = category;
    }

    setDetails(details) {
        this.rateFlow.details = details;
    }

    addRate(rateType, rateValue) {
        if (!this.rateFlow.rate) {
            this.rateFlow.rate = {};
        }

        this.rateFlow.rate[rateType] = rateValue;
    }

    nextStep() {
        this.rateFlow.step += 1;
    }

}

module.exports.RateFlowFacade = RateFlowFacade;
