## 사이트의 ico는 다음과 같이 변경이 가능해요.

```ruby
## 경로: views/layouts/application.html.erb
<!DOCTYPE html>
<html>
  <head>
    <title><%= content_for(:title) || "Tech Blog" %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    {로직..}
    <%= favicon_link_tag "favicon.ico" %>
    <%= favicon_link_tag "apple-touch-icon.png", rel: "apple-touch-icon", type: "image/png" %>
  </head>
</html>
```

ico의 경로는 app/assets/images/favicon.ico 에 할당되면 됩니다.
이후 view에 home 폴더안에 index.hmtl.erb을 만들고 다시 로컬을 키면 사이트에 ico이 적용됩니다.
