/*
 * https://github.com/legalthings/signature-pad-angular
 * Copyright (c) 2015 ; Licensed MIT
 */

angular.module('signature', []);

angular.module('signature').directive('signaturePad', [function() {
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        template: '<div class="signature"><canvas ng-style="{height: height + \'px\', width: width + \'px\'}" style="background: white; border: solid 1px #2c3e50; margin-bottom: 4px;" height="{{ height }}" width="{{ width }}"></canvas></div>',
        scope: {
            clear: '=',
            legalCopy: '=',
            height: '@',
            width: '@'
        },
        link: function(scope, element, attrs, ngModel) {
            var canvas = element.find('canvas')[0];

            var signaturePad = new SignaturePad(canvas, {
                backgroundColor: "rgb(255,255,255)",
                onEnd: function() {
                    if (ngModel) {
                        if (signaturePad.isEmpty()) {
                            ngModel.$setValidity('signatureRequired', false);
                        }
                        else {
                            ngModel.$setValidity('signatureRequired', true);
                        }
                        ngModel.$setViewValue({ legalCopy: scope.legalCopy, signature: signaturePad.toDataURL() });
                    }
                }
            });

            if (!scope.height) scope.height = 220;
            if (!scope.width) scope.width = 568;

            scope.clear = function() {
                signaturePad.clear();
                if (ngModel) {
                    ngModel.$setValidity('signatureRequired', false);
                    ngModel.$setViewValue({ legalCopy: scope.legalCopy, signature: signaturePad.toDataURL() });
                }
            };

                // When zoomed out to less than 100%, for some very strange reason,
                // some browsers report devicePixelRatio as less than 1
                // and only part of the canvas is cleared then.
                var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);

            scope.clear();
        }
    };
}
]);
