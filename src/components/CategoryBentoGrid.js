import React, { useMemo } from "react";
import Link from "next/link";

export const bentoCategoryItems = [
  {
    id: "cad-architecture",
    title: "CAD Architecture",
    slug: "Cad-Architecture",
    defaultCount: "121,297+",
    subtitle: "plans, elevations, sections",
    isBig: true,
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28V10l8-6 8 6v18M12 28V16h8v12M20 14l8 4v10H20" />
      </svg>
    ),
  },
  {
    id: "3d-drawings",
    title: "3D Drawings",
    slug: "3d-Drawings",
    defaultCount: "13,994+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10l12-6 12 6-12 6zM4 10v12l12 6V16M28 10v12l-12 6" />
      </svg>
    ),
  },
  {
    id: "cad-landscape",
    title: "CAD Landscape",
    slug: "Cad-Landscaping",
    defaultCount: "5,021+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="12" r="7" />
        <path d="M16 19v9M10 28h12" />
      </svg>
    ),
  },
  {
    id: "cad-machinery",
    title: "CAD Machinery",
    slug: "Autocad-Machinery-Blocks-&-DWG-Models",
    defaultCount: "3,452+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="5" />
        <path d="M16 3v5M16 24v5M3 16h5M24 16h5M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3" />
      </svg>
    ),
  },
  {
    id: "detail",
    title: "Detail",
    slug: "Detail",
    defaultCount: "15,645+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="22" height="22" rx="2" />
        <path d="M5 13h22M13 13v14" />
      </svg>
    ),
  },
  {
    id: "dwg-blocks",
    title: "DWG Blocks",
    slug: "DWG-Blocks",
    defaultCount: "44,073+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h24M6 22V12h20v10M10 12V8h12v4" />
      </svg>
    ),
  },
  {
    id: "electrical-cad",
    title: "Electrical CAD",
    slug: "Electrical-Cad",
    defaultCount: "7,724+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 3L8 18h7l-2 11 11-16h-7z" />
      </svg>
    ),
  },
  {
    id: "furnitures",
    title: "Furnitures",
    slug: "Autocad-Furniture-Blocks--&-DWG-Models",
    defaultCount: "8,642+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 20v-6a4 4 0 014-4h14a4 4 0 014 4v6M3 20h26v5H3zM7 25v3M25 25v3" />
      </svg>
    ),
  },
  {
    id: "interior-design",
    title: "Interior Design",
    slug: "Interior-design",
    defaultCount: "13,194+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 26h24M7 26V14l9-8 9 8v12M13 26v-7h6v7" />
      </svg>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    slug: "Projects",
    defaultCount: "574+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6h22v20H5zM5 12h22M11 6v20" />
      </svg>
    ),
  },
  {
    id: "structure-detail",
    title: "Structure Detail",
    slug: "Structure-detail",
    defaultCount: "7,663+",
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28V8M4 8h24M4 16h24M16 8v20M4 28h24" />
      </svg>
    ),
  },
  {
    id: "urban-design",
    title: "Urban Design",
    slug: "Urban-design",
    defaultCount: "4,139+",
    isWide: true,
    svg: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28V12h7v16M13 28V4h8v24M23 28V16h5v12" />
      </svg>
    ),
  },
];

export default function CategoryBentoGrid({ initialCategories = [] }) {
  const categoriesWithCounts = useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) {
      return bentoCategoryItems;
    }
    const categoryDataMap = new Map(
      initialCategories.map((c) => [c.slug?.toLowerCase(), c])
    );

    return bentoCategoryItems.map((cat) => {
      const apiData =
        categoryDataMap.get(cat.slug.toLowerCase()) ||
        categoryDataMap.get(cat.id.toLowerCase());

      return {
        ...cat,
        count: apiData?.pcount
          ? `${Number(apiData.pcount).toLocaleString("en-US")}+`
          : cat.defaultCount,
      };
    });
  }, [initialCategories]);

  return (
    <section id="categories" className="categories-bento-section">
      <div className="container">
        <div className="sh">
          <div>
            <h2>Browse by category</h2>
            <p className="sub">
              Find drawings by discipline, from structure details to furniture blocks.
            </p>
          </div>
        </div>
        <div className="cats">
          {categoriesWithCounts.map((category) => {
            if (category.isBig) {
              return (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="cat big"
                  title={`Browse ${category.title}`}
                >
                  <div>
                    {category.svg}
                    <b style={{ fontSize: "22px" }}>{category.title}</b>
                  </div>
                  <div>
                    <strong>{category.count || category.defaultCount}</strong>
                    <span>{category.subtitle}</span>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className={`cat ${category.isWide ? "wide" : ""}`}
                title={`Browse ${category.title}`}
              >
                {category.svg}
                <div>
                  <b>{category.title}</b>
                  <br />
                  <span>{category.count || category.defaultCount}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
