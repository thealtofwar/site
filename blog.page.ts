// some portions taken from https://github.com/pluiedev/site, Copyright (c) 2022-2025 Leah Amelia "pluie" Chen
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. 
// If a copy of the MPL was not distributed with this file, you can obtain one at https://mozilla.org/MPL/2.0/
// simplified in order to fit my requirements

import Searcher from "lume/core/searcher.ts";
import type { PaginateResult, Paginator } from "lume/plugins/paginate.ts";

export const layout = "blogs.vto";

export default async function*({ search, paginate }: { search: Searcher, paginate: Paginator }) {
  const pages = search.pages("blog", "date=desc");
  yield* paginate(pages, {
    url: (n: number) => (n === 1 ? `/blog/` : `/blog/${n}/`),
    size: 20,
    each(page: PaginateResult<unknown>, n: number) {
      const { totalPages } = page.pagination;

      page.currentPage = n;
      page.totalPages = totalPages;

    },
  });
}