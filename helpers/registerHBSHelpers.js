import handlebarsDateFormat from 'handlebars-dateformat';

const blocks = {};

export default function regisHBSHelpers(hbs, app){
    
    
// export locals ato template
hbs.localsAsTemplateData(app);


/*

hbs.registerHelper('helper_name', function(...) { ... });
hbs.registerPartial('partial_name', 'partial value');
*/
hbs.registerPartials(`${__dirname}/../views/partials`, () => {});
// hbs helpers
hbs.registerHelper('link', function(text, options) {
  var attrs = [];

  for (const prop in options.hash) {
    attrs.push(
      `${hbs.handlebars.escapeExpression(prop)}="` +
       `${hbs.handlebars.escapeExpression(options.hash[prop])}"`);
  }

  return new hbs.handlebars.SafeString(
    `<a ${attrs.join(' ')}>${hbs.handlebars.escapeExpression(text)}</a>`
  );
});
hbs.registerHelper('block', function(name) {
  const val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});

hbs.registerHelper('extend', function(name, context) {
  let block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this));
  // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('dateFormat', handlebarsDateFormat);

// Used to increment index
hbs.registerHelper('inc', function(value, options) {
    return parseInt(value) + 1;
});

hbs.registerHelper('JSON', function(value, options) {
return new hbs.handlebars.SafeString(JSON.stringify(value));
});
  

// helper for select tag option
hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(new RegExp(` value=\"${ selected }\"`),
                                    '$& selected="selected"').replace(new RegExp(`>${ selected }</option>`),
                                                                      'selected="selected"$&');
  });
  
  hbs.registerHelper('toLocaleTimeString', function(date){
    return new Date(date).toLocaleTimeString();
  })

  hbs.registerHelper('getFirstWord', function(str){
    return str.split(' ')[0];
  })
  
  // helper use for comparision and operator
  
  hbs.registerHelper({
    eq: (v1, v2) => {
      return v1 === v2;
    },
    ne: (v1, v2) => {
      return v1 !== v2;
    },
    lt: (v1, v2) => {
      return v1 < v2;
    },
    gt: (v1, v2) => {
      return v1 > v2;
    },
    lte: (v1, v2) => {
      return v1 <= v2;
    },
    gte: (v1, v2) => {
      return v1 >= v2;
    },
    and: (v1, v2) => {
      return v1 && v2;
    },
    or: (v1, v2) => {
      return v1 || v2;
    }
  
  });
}