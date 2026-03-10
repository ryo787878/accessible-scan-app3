import { canonicalUrl } from "@/lib/seo/metadata";

export type BreadcrumbNode = {
  label: string;
  path: string;
};

export function createBreadcrumbData(nodes: BreadcrumbNode[]) {
  return {
    pageItems: nodes.map((node, index) => ({
      label: node.label,
      href: index === nodes.length - 1 ? undefined : node.path,
    })),
    jsonLdItems: nodes.map((node) => ({
      name: node.label,
      item: canonicalUrl(node.path),
    })),
  };
}
