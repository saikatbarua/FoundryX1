describe("Gallery", function () {
    var instance;

    beforeEach(function () {
        instance = new R.Module.Gallery(getConfig());
    });

    afterEach(function () {
        instance.destroy();
        instance = null;
    });

    describe("getTemplateData", function () {
        var data;
        beforeEach(function () {
            data = { mos: [] };
        });

        it("should include the current FB user ID", function () {
            var USER_ID = "1234";
            spyOn(R.FB, "getCurrentUserId").andReturn(USER_ID);

            instance.getTemplateData(data);

            expect(R.FB.getCurrentUserId).toHaveBeenCalled();
            expect(data.current_user_id).toBe(USER_ID);
        });

        it("should shuffle the mos when Gallery.ShuffleMos is true", function () {
            var config = getConfig();
            setParam(config, "Gallery.ShuffleMos", true);
            spyOn(R.Util, "shuffle");

            instance = new R.Module.Gallery(config);
            instance.getTemplateData(data);

            expect(R.Util.shuffle).not.toHaveBeenCalled();
        });
    });

    // etc.
});