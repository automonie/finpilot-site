import type { StructureResolver } from 'sanity/structure';

// Desk order writers see: content types first, then the supporting records.
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('guide').title('Guides'),
      S.documentTypeListItem('article').title('Articles'),
      S.divider(),
      S.documentTypeListItem('bank').title('Banks'),
      S.documentTypeListItem('author').title('Authors'),
    ]);
