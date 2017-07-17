<?php

/**
 * Custom page callback
 */
function <%= moduleName %>_page_callback() {
  $output = array();
  <% if (moduleAssetsAddToPage) { %><% if (assets.css) { %>
  $page['#attached']['css'] = array(
    <%= modulePathConstant %> . '/assets/css/<%= moduleName %>.css',
  );<% } %>
  <% if (assets.js) { %>
  $page['#attached']['js'] = array(
    <%= modulePathConstant %> . '/assets/js/<%= moduleName %>.js',
  );<% } %>
  <% } %>
  return $output;
}