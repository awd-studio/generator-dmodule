<?php

/**
 * Custom page callback
 */
function <%= moduleName %>_page_callback() {
  $output = array();
  <% if (moduleAssetsAddToPage) { %>
  $output['#attached'] = array(<% if (assets.css) { %>
    'css' => array(
      <%= modulePathConstant %> . '/assets/css/<%= moduleName %>.css',
    ),<% } %><% if (assets.js) { %>
    'js'  => array(
      <%= modulePathConstant %> . '/assets/js/<%= moduleName %>.js',
    ),<% } %>
  );
  <% } %>
  return $output;
}