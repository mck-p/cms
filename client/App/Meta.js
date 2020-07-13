import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({
  title,
  description,
  keywords,
  robots,
  canonicalUrl,
  favicon,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="robots" content={robots} />
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:url" content={canonicalUrl} />
    <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
  </Helmet>
)

export default Meta
