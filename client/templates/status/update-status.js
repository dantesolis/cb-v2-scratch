//Initialize character counter value
var workingCounterValue = 140;
var learnedCounterValue = 140;
var maxChars = 140;

Template.updateStatus.helpers({
    isWorking: function(type) {
        return type == 'working';
    },
    characterCount: workingCounterValue
});
Template.updateStatus.helpers({
    hasLearned: function(type) {
        return type == 'learned';
    },
    learnedCharacterCount: learnedCounterValue
});

Template.updateStatus.events({
    //Track text for character counting
    'keyup #working-text': function(event) {
        //Check value and if 140 characters have been typed, the user can't type anymore
        var currentLength = $("#working-text").val().length;
        workingCounterValue = maxChars - currentLength;
        //console.log(workingCounterValue);
        $('.charactersLeft').text(workingCounterValue);
    },
    'keyup #learned-text': function(event) {
        //Check value and if 140 characters have been typed, the user can't type anymore
        var currentLength = $("#learned-text").val().length;
        learnedCounterValue = maxChars - currentLength;
        $('.learnedCharactersLeft').text(learnedCounterValue);
    },

    //3 Buttons
    'click #update-working-btn': function(event) {
            var currentStatus = $('#working-text').val();

            if ($.trim(currentStatus) == '') {
                $('#topic').focus();
                sweetAlert({
                    title: TAPi18n.__("Working can't be empty"),
                    confirmButtonText: TAPi18n.__("ok"),
                    type: 'error'
                });
                return;
            }
            Meteor.call('setUserStatus', currentStatus, function(error, result) {});
            $('#working-text').val('');
			$('.charactersLeft').text(140);
    },
    'click #update-learned-btn': function(event) {
        if (!Meteor.userId()) {
            sweetAlert({
                imageUrl: '/images/slack-signin-example.jpg',
                imageSize: '140x120',
                showCancelButton: true,
                title: TAPi18n.__("you_are_almost_there"),
                html: TAPi18n.__("continue_popup_text"),
                confirmButtonText: TAPi18n.__("sign_in_with_slack"),
                cancelButtonText: TAPi18n.__("not_now")
            },
            function(){
              var options = {
                requestPermissions: ['identify', 'users:read']
              };
              Meteor.loginWithSlack(options);
            });
        } else {
            var learningStatus = $('#learned-text').val();

            if ($.trim(learningStatus) == '') {
                $('#topic').focus();
                sweetAlert({
                    title: TAPi18n.__("Accomplishment can't be empty"),
                    confirmButtonText: TAPi18n.__("ok"),
                    type: 'error'
                });
                return;
            }
            var data = {
                user_id: Meteor.userId(),
                username: Meteor.user().username,
                title: learningStatus,
            }
            Meteor.call("addLearning", data, function(error, result) {});
            $('#learned-text').val('');
			$('.learnedCharactersLeft').text(140);
        }
    },
    'click .btn-hangout-status': function(event) {
        var currentType = $(event.currentTarget).attr('data-type');
        if (currentType !== undefined)
            Meteor.call("setHangoutStatus", currentType, function(error, result) {});
    },
    'click .btn-hangout-status': function(event) {
        var currentType = $(event.currentTarget).attr('data-type');
            if (currentType !== undefined) {
              Meteor.call("setHangoutStatus", currentType, function(error, result) {});
              var bgColor;
              switch (currentType) {
                case "silent":
                    bgColor = "#c9302c";
                  break;
                case "teaching":
                    bgColor = "#ec971f";
                  break;
                case "collaboration":
                    bgColor = "#449d44";
                  break;
                default: break;
              }
              $(".btn-hangout-status").each(function(index) {
                $(this).css("background-color","");
              });
              $(event.currentTarget).css("background-color",bgColor);
            }
          }
});

Template.updateStatus.rendered = function() {
  $('[data-toggle=tooltip]').tooltip()
};
