//@ts-nocheck
"use client";

import Contentstack from "contentstack";
require("dotenv").config();
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { useEffect, useState } from "react";

console.log(process.env.NEXT_PUBLIC_APIKEY);
const Stack = Contentstack.Stack({
    api_key: process.env.NEXT_PUBLIC_APIKEY || "",
    delivery_token: process.env.NEXT_PUBLIC_DVT || "",
    environment: "production",
    live_preview: {
        management_token: process.env.NEXT_PUBLIC_MGT || "",
        enable: true,
        host: process.env.NEXT_PUBLIC_HOST || "",
    },
});

ContentstackLivePreview.init({
    stackSdk: Stack,
    enable: true,
    ssr: false,
});

const Page = (props: any) => {
    const [getEntries, setEntries] = useState({});

    const getPageRes = async (entryUrl: string) => {
        const response = (await getEntryByUrl({
            contentTypeUid: "home_page",
            entryUrl,
        })) as any;
        return response[0];
    };

    const getEntryByUrl = async ({
        contentTypeUid,
        entryUrl,
    }) => {
        const data = await Stack.ContentType(contentTypeUid).Query().where("url", entryUrl).toJSON().find();
        return data;
    };

    const fetchData = async () => {
        const result = await getPageRes("/testing");
        setEntries(result[0]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        ContentstackLivePreview.onEntryChange(fetchData);
    });

    const { children } = props;
    return <p>{getEntries.title}</p>;
};

export default Page;
