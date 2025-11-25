# 常見問題模式參考

> 此文件供 issue-review 代理參考，包含跨技術棧的常見問題模式

## 前端問題模式

### React / Vue / Angular

#### 1. 狀態管理問題
```javascript
// 問題：loading 狀態未重置
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.submit(data);
    // 成功處理
  } catch (error) {
    // ❌ 缺少 finally 區塊
    console.error(error);
  }
};

// 修復
const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.submit(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false); // ✅ 確保重置
  }
};
```

#### 2. 非同步競態條件
```javascript
// 問題：快速切換時資料錯亂
useEffect(() => {
  fetchData(id).then(setData);
}, [id]);

// 修復：使用 AbortController 或 cleanup
useEffect(() => {
  let isMounted = true;
  fetchData(id).then(data => {
    if (isMounted) setData(data);
  });
  return () => { isMounted = false; };
}, [id]);
```

#### 3. 記憶體洩漏
```javascript
// 問題：元件卸載後仍嘗試更新狀態
useEffect(() => {
  const timer = setInterval(() => {
    fetchAndUpdate(); // ❌ 未清理
  }, 1000);
}, []);

// 修復
useEffect(() => {
  const timer = setInterval(fetchAndUpdate, 1000);
  return () => clearInterval(timer); // ✅ 清理
}, []);
```

---

## 後端問題模式

### Java / Spring Boot

#### 1. 事務超時
```java
// 問題：事務中包含耗時操作
@Transactional // ❌ 無 timeout
public OrderDTO processOrder(OrderRequest request) {
    inventoryService.checkStock(request); // 可能很慢
    Order order = orderRepository.save(buildOrder(request));
    rabbitTemplate.convertAndSend("order.created", order); // 同步發送
    return toDTO(order);
}

// 修復
@Transactional(timeout = 10) // ✅ 設定超時
public OrderDTO processOrder(OrderRequest request) {
    inventoryService.checkStock(request);
    Order order = orderRepository.save(buildOrder(request));
    eventPublisher.publishEvent(new OrderCreatedEvent(order)); // ✅ 事件驅動
    return toDTO(order);
}
```

#### 2. 連線池耗盡
```yaml
# 問題配置
spring:
  datasource:
    hikari:
      maximum-pool-size: 10  # ❌ 可能不足

# 修復配置
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      connection-timeout: 30000
      leak-detection-threshold: 60000  # ✅ 開啟洩漏偵測
```

#### 3. N+1 查詢
```java
// 問題：懶載入導致 N+1
List<Order> orders = orderRepository.findByUserId(userId);
orders.forEach(order -> {
    order.getItems().forEach(item -> { // ❌ 每次觸發查詢
        // 處理
    });
});

// 修復：使用 JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.userId = :userId")
List<Order> findByUserIdWithItems(@Param("userId") Long userId);
```

### Node.js / Express / NestJS

#### 1. Promise 未處理
```typescript
// 問題：未處理的 Promise rejection
app.get('/api/data', (req, res) => {
  fetchData().then(data => res.json(data)); // ❌ 無 catch
});

// 修復
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    next(error); // ✅ 傳遞給錯誤處理中間件
  }
});
```

#### 2. 請求超時
```typescript
// 問題：無超時控制
const response = await axios.get(url); // ❌ 可能永遠等待

// 修復
const response = await axios.get(url, {
  timeout: 5000 // ✅ 5 秒超時
});
```

### Python / Django / FastAPI

#### 1. 資料庫連線洩漏
```python
# 問題：連線未關閉
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    data = cursor.fetchall()  # ❌ 未關閉
    return data

# 修復：使用 context manager
def get_data():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            return cursor.fetchall()  # ✅ 自動關閉
```

#### 2. 非同步阻塞
```python
# 問題：在 async 函式中使用同步 IO
async def get_external_data():
    response = requests.get(url)  # ❌ 阻塞事件循環
    return response.json()

# 修復
async def get_external_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(url)  # ✅ 非同步
        return response.json()
```

---

## 資料庫問題模式

### MySQL / PostgreSQL

#### 1. 死鎖
```sql
-- 交易 A
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 交易 B（同時）
UPDATE accounts SET balance = balance - 50 WHERE id = 2;
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
-- ❌ 可能死鎖

-- 修復：統一順序
-- 永遠按 id 升序更新
```

#### 2. 慢查詢
```sql
-- 問題：全表掃描
SELECT * FROM orders WHERE status = 'pending';
-- ❌ status 沒有索引

-- 修復
CREATE INDEX idx_orders_status ON orders(status);
```

---

## 快取問題模式

### Redis

#### 1. 快取穿透
```python
# 問題：空值未快取
def get_user(user_id):
    cached = redis.get(f"user:{user_id}")
    if cached:
        return cached
    user = db.query(User).get(user_id)
    if user:
        redis.set(f"user:{user_id}", user)
    return user  # ❌ 空值會一直打到 DB

# 修復
def get_user(user_id):
    cached = redis.get(f"user:{user_id}")
    if cached is not None:  # 包括空值標記
        return None if cached == "NULL" else cached
    user = db.query(User).get(user_id)
    redis.set(f"user:{user_id}", user or "NULL", ex=300)  # ✅ 快取空值
    return user
```

#### 2. 分散式鎖缺失
```java
// 問題：重複提交
public Order createOrder(OrderRequest request) {
    // ❌ 無鎖保護
    return orderRepository.save(buildOrder(request));
}

// 修復
public Order createOrder(OrderRequest request) {
    String lockKey = "order:" + request.getUserId();
    RLock lock = redissonClient.getLock(lockKey);
    try {
        if (lock.tryLock(5, 30, TimeUnit.SECONDS)) {
            return orderRepository.save(buildOrder(request));
        }
        throw new ConcurrentOperationException("請勿重複提交");
    } finally {
        lock.unlock();
    }
}
```

---

## 訊息佇列問題模式

### RabbitMQ / Kafka

#### 1. 訊息遺失
```java
// 問題：未確認就處理
@RabbitListener(queues = "orders")
public void handleOrder(Order order) {
    processOrder(order);  // ❌ 如果處理失敗，訊息已被消費
}

// 修復：手動確認
@RabbitListener(queues = "orders", ackMode = "MANUAL")
public void handleOrder(Order order, Channel channel, @Header("amqp_deliveryTag") long tag) {
    try {
        processOrder(order);
        channel.basicAck(tag, false);  // ✅ 成功後確認
    } catch (Exception e) {
        channel.basicNack(tag, false, true);  // 重新入隊
    }
}
```

---

## 網路問題模式

### HTTP 客戶端

#### 1. 連線池耗盡
```java
// 問題：每次創建新連線
public String callApi() {
    CloseableHttpClient client = HttpClients.createDefault();  // ❌
    // ...
}

// 修復：復用連線池
@Bean
public CloseableHttpClient httpClient() {
    return HttpClients.custom()
        .setConnectionManager(new PoolingHttpClientConnectionManager())
        .build();
}
```

---

## 使用此參考

代理在分析問題時，可以：
1. 識別問題症狀
2. 對照此參考找出匹配的模式
3. 提供針對性的修復建議
