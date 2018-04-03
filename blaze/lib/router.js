FlowRouter.route('/', {
  name:'exam1',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "hello"
    });
  }
});

FlowRouter.route('/exam2', {
  name:'exam2',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "exam2-layout"
    });
  }
});

