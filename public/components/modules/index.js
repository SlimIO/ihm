(async() => {
    await import("../widgets/widget.js");
    // await import("../../../slimio_modules/widget_addon/addons.js");
    await Promise.all([
        import("./dashboard.js"),
        import("./alarmconsole.js")
    ]);
    import("../../js/master.js");
})();
