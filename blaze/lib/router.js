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

FlowRouter.route('/exam2-2-1', {
  name:'custom geo sample',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "customGeoLayout"
    });
  }
});

FlowRouter.route('/exam2-3-1', {
  name:'skined mesh sample',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "skinedMeshLayout"
    });
  }
});

FlowRouter.route('/exam2-4-1', {
  name:'create geometry sample',
  action: function () {
    BlazeLayout.render('layout',{
      layout : "createGeoLayout"
    });
  }
});




