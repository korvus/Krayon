
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
    ["gum","pencil"],
    ["off","on active crayon"],
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

/*
          '<div class="part p1">'+
              '<span class="legend">'+_("size_id")+' :</span>'+
              '<div id="Krayonslider">'+
                  '<input type="range" min="1" max="150" value="1" />'+
              '</div>'+
          '</div>'+
          '<div class="part p2">'+
              '<span class="legend">'+_("color_id")+' :</span>'+
              '<div class="cp"><input type="color" name="colorpicker" id="colorpicker"></div>'+
          '</div>'+
          '<div class="part p4">'+
              '<span id="gomme" title="'+_("mod_ttl_gum_id")+'" class="off">'+_("mod_gomme_id")+'</span>'+
              '<span id="pencil" class="on active crayon">'+_("mod_write_id")+'</span>'+
          '</div>'+
          '<div class="part p5">'+
              '<span title="'+_("mod_ttl_square_id")+'" class="drawsquare">'+_("mod_fullsquare_id")+'</span>'+
              '<span title="'+_("mod_ttl_circle_id")+'" class="drawcircle">'+_("mod_circle_id")+'</span>'+
              '<span title="'+_("mod_ttl_trait_id")+'" class="drawtrait">'+_("mod_trait_id")+'</span>'+
              '<span title="'+_("mod_ttl_emptySquare_id")+'" class="drawsquarempty">'+_("mod_emptysquare_id")+'</span>'+
          '</div>'+
          '<div class="part p6">'+
              '<span class="hide" title="'+_("mod_sansserif_id")+'" id="KrayonTimes">'+_("mod_sansserif_id")+'</span>'+
              '<span class="hide" title="'+_("mod_serif_id")+'" id="KrayonArial">'+_("mod_serif_id")+'</span>'+
              '<span id="entertext">'+_("mod_entertext_id")+'</span>'+
          '</div>'+
          '<div class="part p7">'+
              '<span title="'+_("mod_screenshot")+'" id="screenshot">'+_("mod_screenshot")+'</span>'+
              '<span title="'+_("mod_fullscreenshot")+'" id="fullscreenshot">'+_("mod_fullscreenshot")+'</span>'+
          '</div>'+
          '<div class="part p3">'+
              '<span id="eraseall" class="legend">'+_("mod_erraseall_id")+'</span>'+
          '</div>';
*/