/// <reference types="@slimio/addon" />

declare namespace IHM {
    interface i18n {
        format: string;
        keys: {
            activity_overview: string;
            search: string;
            menu: {
                dashboard: string;
                alarmconsole: string;
                alerting: string;
                metrics: string;
            }
        }
    }
}

export = IHM;
export as namespace IHM;
