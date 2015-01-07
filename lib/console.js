
var _ = require("sdk/l10n").get;

//some translations need across the code
exports.translations = {
  "mod_warning_id" : _("mod_warning_id"),
  "placeholder" : _("placeholder"),
  "label_ID" : _("label_id")
}


/* [ 
 *    [nodetype],
 *    [id],
 *    [class],
 *    [title],
 *    {content} // ref is a keyword for calling some other DOMcontent
 */
exports.console = [
  [
    ["span", "div"],
    ["","Krayonslider"],
    ["legend",""],
    ["",""],
    [{"content":_("size_id")},{"domnode":"ref1"}]
  ],
  [
    ["span","div"],
    ["",""],
    ["legend","cp"],
    ["",""],
    [{"content":_("color_id")},{"domnode":"ref2"}]
  ],
  [
    ["span","span"],
    ["KrayonGum","pencil"],
    ["off","on active pencil"],
    [_("mod_ttl_gum_id"),""],
    [{"content":_("mod_gomme_id")},{"content":_("mod_write_id")}]
  ],
  [
    ["span","span","span","span"],
    ["","","",""],
    ["drawsquare","drawcircle","drawtrait","drawsquarempty"],
    [
      _("mod_ttl_square_id"),
      _("mod_ttl_circle_id"),
      _("mod_ttl_trait_id"),
      _("mod_ttl_emptySquare_id")
    ],
    [
      {"content":_("mod_fullsquare_id")},
      {"content":_("mod_circle_id")},
      {"content":_("mod_trait_id")},
      {"content":_("mod_emptysquare_id")}
    ]
  ],
  [
    ["span","span","span"],
    ["KrayonTimes","KrayonArial","entertext"],
    ["hide","hide",""],
    [_("mod_sansserif_id"),_("mod_serif_id"),""],
    [
      {"content":_("mod_sansserif_id")},
      {"content":_("mod_serif_id")},
      {"content":_("mod_entertext_id")}
    ]
  ],
  [
    ["span","span"],
    ["screenshot","fullscreenshot"],
    ["",""],
    [_("mod_screenshot"),_("mod_fullscreenshot")],
    [{"content":_("mod_screenshot")},{"content":_("mod_fullscreenshot")}]
  ],
  [
    ["span"],
    ["eraseall"],
    ["legend"],
    [""],
    [{"content":_("mod_erraseall_id")}]
  ]
]
