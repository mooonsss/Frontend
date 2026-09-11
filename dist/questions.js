// JSON 格式的题库。answer 是正确选项的下标，从 0 开始。
const quizData = {
  "title": "前端基础小测",
  "questions": [
    {"category":"HTML","question":"哪个 HTML 标签用于创建超链接？","options":["<link>","<a>","<href>","<url>"],"answer":1,"explanation":"<a> 标签用来创建超链接，href 属性指定目标地址，例如 <a href=\"https://example.com\">访问网站</a>。"},
    {"category":"CSS","question":"哪个 CSS 属性用来设置文字颜色？","options":["background-color","font-style","color","text-align"],"answer":2,"explanation":"color 设置文字颜色；background-color 设置背景颜色。"},
    {"category":"JavaScript","question":"表达式 2 + \"3\" 的结果是什么？","options":["数字 5","字符串 \"23\"","数字 23","报错"],"answer":1,"explanation":"加号的一侧是字符串时，会进行字符串拼接，因此结果是字符串 \"23\"。"},
    {"category":"HTML","question":"为图片提供替代文字，应使用哪个属性？","options":["src","href","alt","class"],"answer":2,"explanation":"alt 提供图片的替代文字，帮助屏幕阅读器用户理解图片，也用于图片加载失败时。"},
    {"category":"CSS","question":"在 Flex 布局中，哪个属性控制主轴上的对齐方式？","options":["justify-content","align-items","font-weight","position"],"answer":0,"explanation":"justify-content 控制主轴对齐；align-items 控制交叉轴对齐。主轴方向由 flex-direction 决定。"},
    {"category":"JavaScript","question":"如何监听按钮的点击事件？","options":["button.addEventListener(\"click\", handler)","button.listen(\"click\", handler)","button.on(\"press\", handler)","button.click = handler"],"answer":0,"explanation":"addEventListener 接收事件名称和处理函数。传入 handler 函数本身，在点击时才执行它。"},
    {"category":"JavaScript","question":"数组 [10, 20, 30] 的索引 1 对应哪个值？","options":["10","20","30","undefined"],"answer":1,"explanation":"数组索引从 0 开始，索引 0 是 10，索引 1 是 20，索引 2 是 30。"},
    {"category":"JavaScript","question":"哪个方法可以将 JSON 字符串转换为 JavaScript 对象？","options":["JSON.stringify()","JSON.parse()","JSON.toObject()","Object.json()"],"answer":1,"explanation":"JSON.parse() 将 JSON 字符串解析成对应的 JavaScript 值；JSON.stringify() 则将值转换为 JSON 字符串。"}
  ]
};
