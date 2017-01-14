const Constants = {
    API_KEY: "306bd1f9dda87b11475c98f9d47e3862",
    LANGUAGE: "en-US",
    REGION: "US",
    CATEGORIES: ["POPULARITY", "RELEASE_DATE", "REVENUE", "ORIGINAL_TITLE", "VOTE_AVERAGE", "VOTE_COUNT"],
    get SORT_TYPES () {
        const filters = {};
        this.CATEGORIES.forEach(type => {
            filters[type] = {
                ASCENDING: type.toLowerCase() + ".asc",
                DESCENDING: type.toLowerCase() + ".desc"
            };
        });
        return filters;
    }
};

export default Constants;