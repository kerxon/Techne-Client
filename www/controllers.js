(function() {
  'use strict';

  angular.module('app.controllers', ['nvd3'])
  // TODO: inject me! journalService
  .controller('GoalCtrl', function($state, GoalService, ChartFactory){
    const vm = this;

    vm.$onInit = function() {
      ////TODO: modal.show() to open modal with click etc.
      GoalService.getGoals()
        .then(function(result){
          vm.goals = result.goals;
        })
      vm.options = ChartFactory.options;
      vm.data = ChartFactory.data;
    }

    vm.addGoal = function() {
      $state.go('tab.goal-detail');
    }

    vm.displayGoalProgress = function() {
      console.log("show me this goals status");
    }

    vm.styleStatus = function() {
      console.log('removeClass');
      //fix hover
      // angular.element( document.querySelector( '#goalStatus' ) ).removeClass("ion-ios-pulse");
      // var myEl = angular.element( document.querySelector( '#goalStatus' ) )
      //
      // myEl.addClass("ion-ios-pulse-strong");
    }
  })

  .controller('GoalDetailCtrl', function($state, GoalService){
    const vm = this;
    vm.createGoal = function() {
      vm.newGoal = {
        exercise_name: vm.goal.exercise,
        reps: vm.goal.repetitions,
        load: vm.goal.load,
        finish_date: vm.goal.goalFinishDate
      }
      GoalService.postGoal(vm.newGoal)
      .then(function(){
        // $state.go('tab.goals');
        $state.transitionTo('tab.goals', null, {reload: true, notify:true});
      })
    }
  })

  .controller('SessionCtrl', function($state, $stateParams, SessionService) {
    const vm = this;
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //.on('$ionicView.enter', function(e) {
    //});
    vm.$onInit = function() {
      SessionService.getSessions()
        .then(function(result){
          vm.sessions = result.sessions;
        })
    }

    vm.newTrainingLog = function() {
      vm.session.date = new Date();
      let session = vm.session;
      SessionService.postSession(session)
        .then(function(result){
            return result.session;
        })
        $state.reload();
    }

  })

  .controller('SessionDetailCtrl', function(SessionService, $state, $stateParams, ExerciseService) {
    const vm = this;

    vm.$onInit = function() {
      let sessionId = $stateParams.sessionId;
        SessionService.getSessionWithExercises(sessionId)
          .then((result) => {
            vm.session = result.session;
            return vm.session;
          })
    }

    vm.createExercise = function(){
      let sessionId = $stateParams.sessionId;
      let exercise = vm.session.exercise;
      SessionService.addExercisesToSession(sessionId, exercise)
        .then(function(result){
          vm.session = result;
          return vm.session;
        })
        .then(()=>{
          $state.reload();
        })
      // delete vm.exercise;
    }

    vm.submitSession = function() {
      let session = vm.session;
      let id = session.id;
      console.log(session.id);
      SessionService.updateSession(id, session)
        .then(function(session){
          vm.session = session;
          $state.go('tab.session')
        })
    }

    vm.deleteExercise = function(index){
      console.log('delete this exercise');
      // console.log(vm.session);
      // console.log(vm.session.exercise);
      let exerciseId = vm.session.exercises[index].id;
      console.log(exerciseId);
      // let id = vm.session.exercise.id
      // console.log(id);
      SessionService.deleteExerciseFromSession(exerciseId)
        .then((result) => {
          console.log(result);
          return result;
        })

    }

  })

  .controller('AccountCtrl', function() {
    const vm = this;
    vm.settings = {
      enableFriends: true
    };
  });

}());
