import type { StaticInvitePage } from './types'

const invite: StaticInvitePage = {
  "id": "25748191-d19f-417b-9f59-898bcc7c169a",
  "slug": "ck-ms49x50s-0cd797cc",
  "title": "文权测试大会",
  "venue": "北京",
  "startAt": "2026-07-28T07:28:00.000Z",
  "endAt": "2026-07-30T07:29:00.000Z",
  "intro": "诚挚邀请您出席本次活动，请确认是否参加。",
  "blocks": [
    {
      "id": "4f25b7b1-3b7a-4727-8dfd-867375f5839c",
      "type": "intro",
      "title": "活动介绍",
      "body": "活动介绍111111111111"
    },
    {
      "id": "7d587886-bb05-42a5-b9ab-58e7d0ec51f3",
      "type": "highlights",
      "title": "亮点1",
      "body": "正文正文正文正文正文正文",
      "items": [
        {
          "name": "亮点名称1",
          "role": "一句话",
          "desc": "补充说明补充说明补充说明"
        },
        {
          "name": "亮点名称2",
          "role": "一句话",
          "desc": "补充说明补充说明补充说明"
        }
      ]
    }
  ],
  "agenda": [],
  "backgroundImageUrl": null,
  "confirmApi": {
    "url": "https://collect-gateway.tingxiner.net/collect-service/ads-collect/report",
    "timeoutMs": 20000
  },
  "venueLead": null
}

export default invite
