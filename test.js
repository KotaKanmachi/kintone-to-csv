let maty;

(function() {
  "use strict";

  kv.events.view.mounted = [function (state) {
    console.log(state)
    console.log(state.records)
    maty = state;
    return state;  // 変更後の状態を返さない場合、一部の変更が反映されない場合があります
  }];

})();