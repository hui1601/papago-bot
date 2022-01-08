// Hibot 2022 All Rights Reserved
importPackage(Packages.okhttp3);
const KEY = "aVwDprJBYvnz1NBs8W7GBuaHQDeoynolGF5IdsxyYP6lyCzxAOG38hleJo43NnB6";//네이버 앱마다 다른 hMac키
/**
 * @param url 원본 Api url(md, msgpad없이)
 * @param time unix timestemp로 된 시간
 * @returns String md와 msgpad가 추가된 url
 */
function getUrl(u, t) {
    let m = javax.crypto.Mac.getInstance('HmacSHA1');
    m.init(new javax.crypto.spec.SecretKeySpec(new java.lang.String(KEY).getBytes(), 'HmacSHA1'));
    return (u.includes('?') ? u + '&' : u + '?') + 'msgpad=' + t + '&md=' + encodeURIComponent(java.util.Base64.getEncoder().encodeToString(m.doFinal(new java.lang.String(u.substring(0, Math.min(255, u.length)) + t).getBytes())));
}
const okhttpClient = new OkHttpClient();

function papagoTranslate(source, target, text, honorific) {
    let postBodyBuilder = new FormBody.Builder()
        .add('os', 'ANDROID_11:Redmi Note 7:1.9.1')
        .add('source', source)
        .add('agree', 'false')
        .add('sessionId', papagoTranslate.sessionId)
        .add('locale', 'ko_KR')
        .add('deviceId', '')
        .add('target', target)
        .add('instant', 'false')
        .add('reference', 'KEYBOARD')
        .add('tarTlitTar', source)
        .add('dict', 'false')
        .add('text', text)
        .add('srcTlitTar', 'none');
    if (honorific != null) postBodyBuilder = postBodyBuilder.add('honorific', honorific ? 'true' : 'false');
    let request = new Request.Builder()
        .url(getUrl('https://apis.naver.com/papago/papago_app/n2mt/translate', Date.now()))
        .post(postBodyBuilder.build())
        .build();
    return JSON.parse(okhttpClient.newCall(request).execute().body().string());
}
papagoTranslate.sessionId = java.util.UUID.randomUUID();
// 여기까지는 함수 구현입니다.
// 아래부터는 명령어 처리입니다.

const bot = BotManager.getCurrentBot();
/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (string) msg.command: 명령어 이름
 * (Array) msg.args: 명령어 인자 배열
 */
function onCommand(msg) {
    if (msg.command != 'papago' || msg.args.length <= 2) return;
    const source = msg.args[0];
    const target = msg.args[1];
    const text = msg.args.splice(2).join(' ');
    const trs = papagoTranslate(source, target, text, false);
    if (trs.errorCode) {
        msg.reply('오류(' + trs.errorCode + '): ' + trs.errorMessage);
    }
    else msg.reply('번역결과: ' + trs.message.result.translatedText);
}
bot.setCommandPrefix("/"); // /로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);
