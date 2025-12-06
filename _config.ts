import lume from "lume/mod.ts";
import mila from "markdown-it-link-attributes";
import lightningCSS from "lume/plugins/lightningcss.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import { parse } from "https://deno.land/std@0.224.0/yaml/mod.ts";

const markdown = {
    plugins: [
        [mila, {
            attrs: {
                target: "_blank",
                rel: "noopener",
            },
        }],
    ],
};

const site = lume({}, { markdown });

site.add("/assets");
site.use(lightningCSS());
site.use(minifyHTML());

const data = parse(await Deno.readTextFile("_data.yml")) as { name: string, email: string };

const replacements = {
    "NAME": data.name,
    "EMAIL": data.email
}

site.filter("formatDate", (date: Date) => {
    // hacky way to reconstitute date into local time, since the date is utc in yaml
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});

site.filter("replacePlaceholders", (original: string) => {
    for (const [key, value] of Object.entries(replacements)) {
        original = original.replaceAll(key, value);
    }
    return original;
});

site.filter("formatTags", (tags: string[]) => {
    const tags_filtered = tags.filter((t) => t !== "blog");
    let result = "";
    for (const [index, item] of tags_filtered.entries()) {
        result += item;
        if (index < tags_filtered.length - 1) {
            result += ", "
        }
    }
    return result;
});

export default site;
