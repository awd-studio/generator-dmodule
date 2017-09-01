<?php

/**
 * Custom page callback
 */
function <%= moduleName %>_page_callback() {
  $output = array();
  <% if (moduleAssetsAddToPage) { %><% if (assets.css) { %>
  $output['#attached']['css'][] = H<%= modulePathConstant %> . '/assets/css/<%= moduleName %>.css';<% } %>
  <% if (assets.js) { %>
    $output['#attached']['js'][] = <%= modulePathConstant %> . '/assets/js/<%= moduleName %>.js';<% } %>
  <% } %>
  return $output;
}
