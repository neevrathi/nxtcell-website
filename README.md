# NXTCell Mobility — website

Static site for **nxtcellmobility.com**, built with Jekyll and hosted on GitHub Pages.

## Editing the site

Content is managed through **[Pages CMS](https://app.pagescms.org)** — sign in with GitHub,
select this repository, and edit. Every save commits to `main`, and GitHub Pages rebuilds
and republishes automatically (about a minute).

* **Products** — add, edit, reorder, publish or unpublish. A product only appears on the
  public site when *Published on the website* is switched on.
* **Site settings** — company name, enquiry email, address, meta description, analytics ID
  and the enquiry-form endpoint.
* **Page — …** — the heading, intro paragraph and meta description for each page.

## Structure

```
_config.yml            site + company settings
.pages.yml             CMS schema
_layouts/              default, page, product
_includes/form.html    shared enquiry form
_products/             product entries (markdown, managed by the CMS)
assets/img/products/   product images uploaded via the CMS
assets/files/          datasheets uploaded via the CMS
```

## Enquiry form

The form posts JSON to the Google Apps Script web app configured in `form_endpoint`
(Site settings). Submissions are appended to a Google Sheet and emailed to the enquiry
address. If `form_endpoint` is blank, the form falls back to opening the visitor's mail
client addressed to the enquiry email — it never fails silently.
