# Taxonomy

- Taxonomy in broader / general sense is a hierarchical grouping of things etc.,
- The Taxonomy plugin is a frontend, backend, and a client package that provides capability for users to view the catalog items classified against one or more associated taxonomies.

# Taxonomy Client

Welcome to the taxonomy client plugin for backstage.

Contains a frontend and backend compatible client for communicating with the
Backstage Taxonomy.

Backend code may import and use this package directly.

However, frontend code will not want to instantiate a taxonomy client directly -
use the `@deutschebank/taxonomy` package instead, which exports a
`taxonomyApiRef` that can be leveraged like other frontend utility APIs.

## Links

- [Default frontend part of the taxonomy](../../plugins/taxonomy)
- [Default backend part of the taxonomy](../../plugins/taxonomy-backend)
- [The Backstage homepage](https://backstage.io)