const Constants = {
    API_KEY: "f4f63c18112433e482a4a2afc14261ac",
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
