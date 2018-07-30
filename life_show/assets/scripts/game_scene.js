cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.game_started = false;
        this.ske_player_com = cc.find("UI_ROOT/anchor-center/play_root/player").getComponent(sp.Skeleton);
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.checkout_root.active = false;
        
        this.card_root = cc.find("UI_ROOT/card_root");
        this.card_root.active = false;
        this.is_showed_card = false;
        this.ui_card = cc.find("UI_ROOT/anchor-center/ui_card");
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        this.play_sound("resources/sounds/start.mp3");
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.play_start_anim();
        this.center_pos = cc.find("UI_ROOT/anchor-center/play_root").convertToWorldSpaceAR(cc.p(0, 0));
        this.checkout_root.active = false;
        this.on_game_start();
    },
    
    on_game_replay: function() {
        this.checkout_root.active = false;
        this.on_game_start();
    }, 
    
    on_game_start: function() {
        this.game_started = true;
        this.checkout_root.active = false;
        this.game_result = [0, 0, 0, 0, 0];
    },
    
    play_sound: function(name) {
        cc.audioEngine.stopAllEffects()
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },
    
    play_sound_loop: function(name) {
        cc.audioEngine.stopAllEffects()
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, true);
    },
    
    play_life_anim:function(m_type) {
        this.node.stopAllActions();
        var type_action = ["tanjita", "chuilaba", "wanpiqiu", "zhuanhulaquan", "dagu"];
        var type_sound = ["resources/sounds/daoju1.mp3", "resources/sounds/daoju2.mp3", "resources/sounds/daoju3.mp3", 
                          "resources/sounds/daoju4.mp3", "resources/sounds/daoju5.mp3"];
        this.play_sound_loop(type_sound[m_type - 1]);
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, type_action[m_type - 1], true);
        /*this.call_latter(function() {
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "putongdaiji", true);
        }.bind(this), 2);*/
    }, 
    
    play_life_anim_good_film:function() {
        cc.audioEngine.stopMusic(false);
        
        var name = "manzukaixin";
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, name, true);
        this.call_latter(function() {
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "putongdaiji", true);
            this.checkout_root.active = true;
            this.play_sound("resources/sounds/end.mp3");    
        }.bind(this), 3);
    }, 
    
    is_show_card: function() {
        if (this.is_showed_card) {
            return false;
        }
        var num = 0;
        for(var i = 0; i < this.game_result.length; i ++) {
            if(this.game_result[i] === 1) {
                num ++;    
            }
        }
        if (num === 4) {
            return true;
        }
        return false;
    },
    
    is_checkout_success: function() {
        for(var i = 0; i < this.game_result.length; i ++) {
            if(this.game_result[i] === 0) {
                return false;    
            }
        }
        return true;
    },
    
    show_checkout: function() {
        this.game_started = false;
        // 播放满足动画
        this.call_latter(this.play_life_anim_good_film.bind(this), 2);
        // end
        
    },
    
    on_prop_hit: function(m_type) {
        if(this.game_started === false) {
            return;
        }
        
        // 播放动画
        this.play_life_anim(m_type);
        // end 
    
        // 结算
        this.game_result[m_type - 1] = 1;
        // 知识卡
        if (this.is_show_card()) {
            this.show_card();
        }
        // end 
        
        if (this.is_checkout_success()) {
            this.show_checkout();
        }
        // end
    },
    
    show_card: function() {
        this.card_root.active = true;
        this.is_showed_card = true;
        this.ui_card.active = true;
        
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/desic.mp3");
        }.bind(this), 1);
    },
    
    hide_card: function() {
        cc.audioEngine.stopMusic(false);
        this.card_root.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});