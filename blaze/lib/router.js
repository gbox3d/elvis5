FlowRouter.route('/', {
  name:'exam1',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "hello"
    });
  }
});

FlowRouter.route('/skeleton', {
  name:'skeleton layout',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "skeleton-layout"
    });
  }
});


FlowRouter.route('/exam2-1', {
  name:'exam2-1 layout',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "exam2-1-layout"
    });
  }
});



