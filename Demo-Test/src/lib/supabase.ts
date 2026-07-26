import type { Database } from "./supabase.types";

// Unified Local Storage Keys
const STORAGE_KEYS = {
  TABLES: "ran-lung-get-tables",
  ORDERS: "supabase_orders",
  ORDER_ITEMS: "supabase_order_items",
  INGREDIENTS: "ran-lung-get-mock-ingredients",
  USERS: "ran-lung-get-users",
  CUSTOMERS: "ran-lung-get-customers",
  SESSION: "demo-session-active",
  MENU_ITEMS: "supabase_menu_items",
};

// Event emitter for local cross-component and cross-tab real-time simulation
const LOCAL_REALTIME_EVENT = "local_supabase_realtime_change";
const broadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel("local_supabase_realtime")
  : null;

function notifyRealtimeChange(table: string, eventType: "INSERT" | "UPDATE" | "DELETE", newRecord: any, oldRecord?: any) {
  if (typeof window === "undefined") return;
  const payload = { schema: "public", table, eventType, new: newRecord, old: oldRecord };

  // 1. Dispatch in-memory event for same browser window
  window.dispatchEvent(new CustomEvent(LOCAL_REALTIME_EVENT, { detail: payload }));

  // 2. Post message to BroadcastChannel for cross-tab sync
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch { /* ignore */ }
  }
}

class MockQueryBuilder {
  private tableName: string;
  private filters: any[] = [];
  private limitCount: number | null = null;
  private sortCol: string | null = null;
  private sortAsc: boolean = true;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string = "*") {
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ type: "eq", col, val });
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    this.sortCol = col;
    this.sortAsc = options?.ascending !== false;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  single() {
    return this.then((res: any) => {
      const first = Array.isArray(res?.data) ? res.data[0] : res?.data;
      return { data: first || null, error: null };
    });
  }

  maybeSingle() {
    return this.single();
  }

  async then(resolve: any, reject?: any) {
    try {
      const res = await this.execute();
      return resolve(res);
    } catch (err) {
      if (reject) return reject(err);
      return resolve({ data: null, error: err });
    }
  }

  private async execute() {
    if (typeof window === "undefined") {
      return { data: [], error: null };
    }

    if (this.tableName === "restaurant_tables") {
      const raw = localStorage.getItem(STORAGE_KEYS.TABLES);
      let data = raw ? JSON.parse(raw) : [
        { id: "1", label: "โต๊ะ 1", status: "available", capacity: 4, table_type: "normal" },
        { id: "2", label: "โต๊ะ 2", status: "available", capacity: 4, table_type: "normal" },
        { id: "3", label: "โต๊ะ 3", status: "available", capacity: 4, table_type: "normal" },
        { id: "4", label: "โต๊ะ 4", status: "available", capacity: 4, table_type: "normal" },
        { id: "5", label: "โต๊ะ 5", status: "available", capacity: 4, table_type: "normal" },
        { id: "6", label: "โต๊ะ 6", status: "available", capacity: 4, table_type: "normal" },
        { id: "7", label: "โต๊ะ 7", status: "available", capacity: 4, table_type: "normal" },
        { id: "8", label: "โต๊ะ 8", status: "available", capacity: 4, table_type: "normal" },
        { id: "9", label: "โต๊ะ 9 (Walk-in)", status: "available", capacity: 4, table_type: "walkin" },
        { id: "10", label: "โต๊ะ 10 (Walk-in)", status: "available", capacity: 4, table_type: "walkin" }
      ];

      // Save default if not present
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(data));
      }

      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => String(item[f.col]) === String(f.val));
        }
      }
      return { data, error: null };
    }

    if (this.tableName === "ingredients") {
      const raw = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
      let data = raw ? JSON.parse(raw) : [
        { id: "mock-1", name: "หมูสับ", quantity: 1000, unit: "g", min_threshold: 200, is_active: true },
        { id: "mock-2", name: "หมูกรอบ", quantity: 1000, unit: "g", min_threshold: 200, is_active: true },
        { id: "mock-3", name: "หมูชิ้น", quantity: 1000, unit: "g", min_threshold: 200, is_active: true },
        { id: "mock-4", name: "ไก่สับ", quantity: 1000, unit: "g", min_threshold: 200, is_active: true },
        { id: "mock-10", name: "ไข่ไก่", quantity: 100, unit: "pcs", min_threshold: 15, is_active: true }
      ];
      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => item[f.col] === f.val);
        }
      }
      return { data, error: null };
    }

    if (this.tableName === "recipe_items") {
      const data = [
        { option_id: "opt-mu-sap", ingredient_id: "mock-1", quantity_required: 80 },
        { option_id: "opt-mu-krob", ingredient_id: "mock-2", quantity_required: 80 },
        { option_id: "opt-mu-chin", ingredient_id: "mock-3", quantity_required: 80 },
        { option_id: "opt-kai-sap", ingredient_id: "mock-4", quantity_required: 80 },
        { option_id: "opt-kai-tom", ingredient_id: "mock-5", quantity_required: 80 },
        { option_id: "opt-nua", ingredient_id: "mock-6", quantity_required: 80 },
        { option_id: "opt-muek", ingredient_id: "mock-7", quantity_required: 80 },
        { option_id: "opt-kung", ingredient_id: "mock-8", quantity_required: 80 },
        { option_id: "opt-hoi-lay", ingredient_id: "mock-9", quantity_required: 80 },
        { option_id: "opt-khai-kai", ingredient_id: "mock-10", quantity_required: 1 },
        { option_id: "opt-sai-krog", ingredient_id: "mock-11", quantity_required: 1 },
        { option_id: "opt-kun-chiang", ingredient_id: "mock-12", quantity_required: 1 }
      ];
      return { data, error: null };
    }

    if (this.tableName === "users") {
      let data = [
        { id: "mock-user-123", email: "demo@botnoi.ai", role: "admin", is_active: true },
        { id: "staff-1", email: "staff@demo.com", role: "staff", is_active: true }
      ];
      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => item[f.col] === f.val);
        }
      }
      return { data, error: null };
    }

    if (this.tableName === "menu_items") {
      const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      let data = raw ? JSON.parse(raw) : [
        {
          id: "m_krapao_pork",
          name: "กระเพราหมูสับ (ข้าวราด)",
          description: "กระเพราหมูสับผัดกับพริกและกระเทียม เสิร์ฟราดข้าวไทยร้อนๆ",
          price: 60,
          image: "/meal/krapao.jpg",
          image_url: null,
          category: "signature",
          is_available: true,
          is_spicy: true,
          sort_order: 0,
          options: [{ id: "spicy", name: "ระดับความเผ็ด", choices: [{ id: "0", label: "ไม่เผ็ด" }, { id: "1", label: "เผ็ดน้อย" }, { id: "2", label: "เผ็ดกลาง" }, { id: "3", label: "เผ็ดมาก" }] }],
          addons: [{ id: "egg", name: "ไข่ดาว", price: 10 }, { id: "bacon", name: "หมูกรอบ", price: 20 }],
          staff_note: null,
        },
        {
          id: "m_pad_nam_prik_pao",
          name: "ผัดพริกเผา (ข้าวราด)",
          description: "ผัดเครื่องพริกเผาเข้มข้น เคล้ากับเนื้อหรือไก่ตามสั่ง เสิร์ฟพร้อมข้าว",
          price: 65,
          image: "/meal/pad_tua_sea.jpg",
          image_url: null,
          category: "signature",
          is_available: true,
          is_spicy: true,
          sort_order: 1,
          options: null,
          addons: [{ id: "egg", name: "ไข่ดาว", price: 10 }],
          staff_note: null,
        },
        {
          id: "m_pad_nam_oil",
          name: "ผัดน้ำมันหอย (ข้าว/เส้น)",
          description: "ผัดด้วยน้ำมันหอยหอมหวาน เลือกเนื้อสัตว์และข้าว/เส้นได้ตามต้องการ",
          price: 65,
          image: "/meal/khao_moo_garlic.jpg",
          image_url: null,
          category: "main",
          is_available: true,
          is_spicy: false,
          sort_order: 2,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_pad_see_ew",
          name: "ผัดซีอิ๊ว (เส้นใหญ่)",
          description: "เส้นใหญ่ผัดซีอิ๊วแบบร้านตามสั่ง ปรุงรสกลมกล่อม เสิร์ฟร้อน",
          price: 70,
          image: "/meal/pad_see_ew.jpg",
          image_url: null,
          category: "noodles",
          is_available: true,
          is_spicy: false,
          sort_order: 3,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_fried_rice",
          name: "ข้าวผัดกระเทียม (ข้าวผัด)",
          description: "ข้าวผัดกลิ่นกระเทียม เจียวจนหอม พร้อมผักและเนื้อสัตว์เลือกได้",
          price: 70,
          image: "/meal/fried_rice.jpg",
          image_url: null,
          category: "rice",
          is_available: true,
          is_spicy: false,
          sort_order: 4,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_pad_phong_kari",
          name: "ผัดผงกะหรี่ (ไก่/หมู)",
          description: "ผัดผงกะหรี่รสกลมกล่อม เสิร์ฟพร้อมข้าวร้อนๆ",
          price: 75,
          image: "/meal/pad_pong_gari.jpg",
          image_url: null,
          category: "main",
          is_available: true,
          is_spicy: false,
          sort_order: 5,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_pad_pak",
          name: "ผัดผักรวม (กับข้าว)",
          description: "ผัดผักสดหลากหลาย ปรุงรสอ่อนๆ ทานคู่กับข้าวสวย",
          price: 55,
          image: "/meal/pad_pak.jpg",
          image_url: null,
          category: "vegetarian",
          is_available: true,
          is_spicy: false,
          sort_order: 6,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_pad_prik_gaeng",
          name: "ผัดพริกแกง (ตามสั่ง)",
          description: "ผัดพริกแกงกลมกล่อม สามารถเลือกเป็นหมู ไก่ หรือทะเลได้",
          price: 80,
          image: "/meal/pad_tua_sea.jpg",
          image_url: null,
          category: "signature",
          is_available: true,
          is_spicy: true,
          sort_order: 7,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "d_water",
          name: "น้ำเปล่า",
          description: "น้ำดื่มเย็นๆ ขวดเล็ก",
          price: 15,
          image: "/meal/water.jpg",
          image_url: null,
          category: "drinks",
          is_available: true,
          is_spicy: false,
          sort_order: 8,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "d_coke",
          name: "โค้ก (ขวด)",
          description: "น้ำอัดลม ซีโร่/ปกติ ตามสต็อก",
          price: 35,
          image: "/meal/coke.jpg",
          image_url: null,
          category: "drinks",
          is_available: true,
          is_spicy: false,
          sort_order: 9,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "d_luangyai",
          name: "น้ำลำไย",
          description: "น้ำลำไยหวานหอม เสิร์ฟเย็น",
          price: 45,
          image: "/meal/longan_juice.jpg",
          image_url: null,
          category: "drinks",
          is_available: true,
          is_spicy: false,
          sort_order: 10,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "m_krapao_crispy_pork",
          name: "กระเพราหมูกรอบ (ข้าวราด)",
          description: "กระเพราหมูกรอบหนังสามชั้นกรอบนอกนุ่มใน ผัดใบกระเพราแท้รสจัดจ้าน เสิร์ฟราดข้าวหอมมะลิร้อนๆ",
          price: 75,
          image: "/meal/krapao.jpg",
          image_url: null,
          category: "signature",
          is_available: true,
          is_spicy: true,
          sort_order: 11,
          options: [{ id: "spicy", name: "ระดับความเผ็ด", choices: [{ id: "0", label: "ไม่เผ็ด" }, { id: "1", label: "เผ็ดน้อย" }, { id: "2", label: "เผ็ดกลาง" }, { id: "3", label: "เผ็ดมาก" }] }],
          addons: [{ id: "egg", name: "ไข่ดาว", price: 10 }],
          staff_note: null,
        },
        {
          id: "m_kana_crispy_pork",
          name: "ผัดคะน้าหมูกรอบ (ข้าวราด)",
          description: "ผัดคะน้าใบเขียวสดกรอบกับหมูกรอบสามชั้น ปรุงรสกลมกล่อม ราดข้าวหอมมะลิร้อนๆ",
          price: 75,
          image: "/meal/pad_pak.jpg",
          image_url: null,
          category: "signature",
          is_available: true,
          is_spicy: false,
          sort_order: 12,
          options: null,
          addons: [{ id: "egg", name: "ไข่ดาว", price: 10 }],
          staff_note: null,
        },
        {
          id: "m_garlic_pork",
          name: "กระเทียมพริกไทยหมูชิ้น (ข้าวราด)",
          description: "หมูชิ้นนุ่มๆ ผัดซอสกระเทียมพริกไทยรสเข้มข้น หอมกระเทียมเจียว ราดข้าว",
          price: 65,
          image: "/meal/khao_moo_garlic.jpg",
          image_url: null,
          category: "main",
          is_available: true,
          is_spicy: false,
          sort_order: 13,
          options: null,
          addons: [{ id: "egg", name: "ไข่ดาว", price: 10 }],
          staff_note: null,
        },
        {
          id: "m_curry_seafood",
          name: "ผัดผงกะหรี่ทะเล (ข้าวราด)",
          description: "เนื้อกุ้งและปลาหมึกสดผัดผงกะหรี่เข้มข้น ไข่นุ่มละมุนลิ้น ราดข้าวหอมมะลิ",
          price: 85,
          image: "/meal/pad_pong_gari.jpg",
          image_url: null,
          category: "main",
          is_available: true,
          is_spicy: false,
          sort_order: 14,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "d_orange_juice",
          name: "น้ำส้มคั้น",
          description: "น้ำส้มคั้นสด หวานอมเปรี้ยว",
          price: 40,
          image: "/meal/water.jpg",
          image_url: null,
          category: "drinks",
          is_available: true,
          is_spicy: false,
          sort_order: 15,
          options: null,
          addons: null,
          staff_note: null,
        },
        {
          id: "d_grass_jelly",
          name: "เฉาก๊วย",
          description: "เฉาก๊วยเย็นหวานกำลังดี ท็อปด้วยน้ำเชื่อม",
          price: 35,
          image: "/meal/longan_juice.jpg",
          image_url: null,
          category: "drinks",
          is_available: true,
          is_spicy: false,
          sort_order: 16,
          options: null,
          addons: null,
          staff_note: null,
        },
      ];

      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(data));
      }

      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => String(item[f.col]) === String(f.val));
        }
      }

      if (this.sortCol === "sort_order") {
        data = [...data].sort((a: any, b: any) => (this.sortAsc ? a.sort_order - b.sort_order : b.sort_order - a.sort_order));
      }

      return { data, error: null };
    }

    if (this.tableName === "customers") {
      const data = [{ id: "cust-1", display_name: "ลูกค้าทั่วไป" }];
      return { data, error: null };
    }

    if (this.tableName === "orders") {
      const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const rawItems = localStorage.getItem(STORAGE_KEYS.ORDER_ITEMS);

      const ordersData = rawOrders ? JSON.parse(rawOrders) : [
        {
          id: "ord-mock-101",
          order_number: "AK-1001",
          user_id: "mock-user-123",
          customer_id: "cust-1",
          order_type: "dine-in",
          status: "pending",
          subtotal: 178,
          delivery_fee: 0,
          total: 178,
          table_number: "โต๊ะ 1",
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: "ord-mock-102",
          order_number: "AK-1002",
          user_id: "mock-user-123",
          customer_id: "cust-1",
          order_type: "takeaway",
          status: "preparing",
          subtotal: 238,
          delivery_fee: 0,
          total: 238,
          table_number: null,
          queue_number: "Q-05",
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        }
      ];

      const itemsData = rawItems ? JSON.parse(rawItems) : [
        {
          order_id: "ord-mock-101",
          item_id: "krapao",
          name: "ข้าวกะเพราหมูกรอบ",
          unit_price: 89,
          quantity: 2,
          line_total: 178,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          order_id: "ord-mock-102",
          item_id: "tomyum",
          name: "ต้มยำกุ้งน้ำข้น",
          unit_price: 179,
          quantity: 1,
          line_total: 179,
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        },
        {
          order_id: "ord-mock-102",
          item_id: "krapao",
          name: "ข้าวกะเพราไก่ไข่ดาว",
          unit_price: 59,
          quantity: 1,
          line_total: 59,
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        }
      ];

      if (!rawOrders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersData));
      if (!rawItems) localStorage.setItem(STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(itemsData));

      let data = ordersData.map((o: any) => ({
        ...o,
        customers: { display_name: "ลูกค้าหน้าร้าน" },
        order_items: itemsData.filter((item: any) => item.order_id === o.id)
      }));

      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => String(item[f.col]) === String(f.val));
        }
      }

      if (this.sortCol === "created_at") {
        data = [...data].sort((a: any, b: any) => {
          const t1 = new Date(a.created_at).getTime();
          const t2 = new Date(b.created_at).getTime();
          return this.sortAsc ? t1 - t2 : t2 - t1;
        });
      }

      return { data, error: null };
    }

    if (this.tableName === "order_items") {
      let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_ITEMS) || "[]");
      for (const f of this.filters) {
        if (f.type === "eq") {
          data = data.filter((item: any) => item[f.col] === f.val);
        }
      }
      return { data, error: null };
    }

    return { data: [], error: null };
  }

  async insert(data: any) {
    if (typeof window === "undefined") return { data, error: null };

    if (this.tableName === "orders") {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
      const list = Array.isArray(data) ? data : [data];
      orders.push(...list);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      list.forEach((item) => notifyRealtimeChange("orders", "INSERT", item));
      return { data, error: null };
    }

    if (this.tableName === "order_items") {
      const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_ITEMS) || "[]");
      const list = Array.isArray(data) ? data : [data];
      items.push(...list);
      localStorage.setItem(STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(items));
      list.forEach((item) => notifyRealtimeChange("order_items", "INSERT", item));
      return { data, error: null };
    }

    if (this.tableName === "restaurant_tables") {
      const raw = localStorage.getItem(STORAGE_KEYS.TABLES);
      const tables = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(data) ? data : [data];
      const insertedList = list.map((t, idx) => ({
        id: t.id ? String(t.id) : String(tables.length + idx + 1),
        status: "available",
        capacity: 4,
        table_type: "normal",
        ...t,
      }));
      tables.push(...insertedList);
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      insertedList.forEach((item) => notifyRealtimeChange("restaurant_tables", "INSERT", item));
      return { data: insertedList.length === 1 ? insertedList[0] : insertedList, error: null };
    }

    if (this.tableName === "ingredients") {
      const ing = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || "[]");
      const list = Array.isArray(data) ? data : [data];
      ing.push(...list);
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ing));
      list.forEach((item) => notifyRealtimeChange("ingredients", "INSERT", item));
      return { data, error: null };
    }

    if (this.tableName === "menu_items") {
      const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      const items = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(data) ? data : [data];
      items.push(...list);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      list.forEach((item) => notifyRealtimeChange("menu_items", "INSERT", item));
      return { data: list.length === 1 ? list[0] : list, error: null };
    }

    return { data, error: null };
  }

  async update(values: any) {
    if (typeof window === "undefined") return { data: values, error: null };

    if (this.tableName === "orders") {
      let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
      let updatedItem: any = null;
      orders = orders.map((o: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(o[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) {
          updatedItem = { ...o, ...values };
          return updatedItem;
        }
        return o;
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      if (updatedItem) notifyRealtimeChange("orders", "UPDATE", updatedItem);
      return { data: values, error: null };
    }

    if (this.tableName === "restaurant_tables") {
      let tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || "[]");
      let updatedItem: any = null;
      tables = tables.map((t: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(t[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) {
          updatedItem = { ...t, ...values, id: String(t.id) };
          return updatedItem;
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      if (updatedItem) notifyRealtimeChange("restaurant_tables", "UPDATE", updatedItem);
      return { data: values, error: null };
    }

    if (this.tableName === "ingredients") {
      let ing = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || "[]");
      let updatedItem: any = null;
      ing = ing.map((i: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(i[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) {
          updatedItem = { ...i, ...values };
          return updatedItem;
        }
        return i;
      });
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ing));
      if (updatedItem) notifyRealtimeChange("ingredients", "UPDATE", updatedItem);
      return { data: values, error: null };
    }

    if (this.tableName === "menu_items") {
      let items = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]");
      let updatedItem: any = null;
      items = items.map((m: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(m[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) {
          updatedItem = { ...m, ...values };
          return updatedItem;
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      if (updatedItem) notifyRealtimeChange("menu_items", "UPDATE", updatedItem);
      return { data: values, error: null };
    }

    return { data: values, error: null };
  }

  async delete() {
    if (typeof window === "undefined") return { data: null, error: null };

    if (this.tableName === "restaurant_tables") {
      let tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || "[]");
      let deletedItem: any = null;
      tables = tables.filter((t: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(t[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) deletedItem = t;
        return !match;
      });
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      if (deletedItem) notifyRealtimeChange("restaurant_tables", "DELETE", null, deletedItem);
      return { data: null, error: null };
    }

    if (this.tableName === "ingredients") {
      let ing = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || "[]");
      let deletedItem: any = null;
      ing = ing.filter((i: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(i[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) deletedItem = i;
        return !match;
      });
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ing));
      if (deletedItem) notifyRealtimeChange("ingredients", "DELETE", null, deletedItem);
      return { data: null, error: null };
    }

    if (this.tableName === "menu_items") {
      let items = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]");
      let deletedItem: any = null;
      items = items.filter((m: any) => {
        let match = true;
        for (const f of this.filters) {
          if (f.type === "eq" && String(m[f.col]) !== String(f.val)) {
            match = false;
          }
        }
        if (match) deletedItem = m;
        return !match;
      });
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      if (deletedItem) notifyRealtimeChange("menu_items", "DELETE", null, deletedItem);
      return { data: null, error: null };
    }

    return { data: null, error: null };
  }
}

class MockChannel {
  private name: string;
  private cleanupWindow?: () => void;
  private cleanupBroadcast?: () => void;

  constructor(name: string) {
    this.name = name;
  }

  on(event: string, filter: { event?: string; schema?: string; table?: string }, callback: (payload: any) => void) {
    const targetTable = filter?.table || "*";

    if (typeof window !== "undefined") {
      const handlePayload = (payload: any) => {
        if (targetTable === "*" || payload.table === targetTable) {
          callback(payload);
        }
      };

      const windowHandler = (e: Event) => {
        const customEv = e as CustomEvent;
        if (customEv.detail) {
          handlePayload(customEv.detail);
        }
      };

      window.addEventListener(LOCAL_REALTIME_EVENT, windowHandler);

      let broadcastHandler: ((e: MessageEvent) => void) | null = null;
      if (broadcastChannel) {
        broadcastHandler = (e: MessageEvent) => {
          if (e.data) {
            handlePayload(e.data);
          }
        };
        broadcastChannel.addEventListener("message", broadcastHandler);
      }

      this.cleanupWindow = () => window.removeEventListener(LOCAL_REALTIME_EVENT, windowHandler);
      this.cleanupBroadcast = () => {
        if (broadcastChannel && broadcastHandler) {
          broadcastChannel.removeEventListener("message", broadcastHandler);
        }
      };
    }

    return this;
  }

  subscribe() {
    return {
      unsubscribe: () => {
        if (this.cleanupWindow) this.cleanupWindow();
        if (this.cleanupBroadcast) this.cleanupBroadcast();
      }
    };
  }
}

export const supabase = {
  auth: {
    async getSession() {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.SESSION) === "false") {
        return { data: { session: null }, error: null };
      }
      return {
        data: {
          session: {
            user: {
              id: "mock-user-123",
              email: "demo@botnoi.ai",
              user_metadata: { role: "admin" }
            }
          }
        },
        error: null
      };
    },
    onAuthStateChange(callback: any) {
      if (typeof window !== "undefined") {
        const active = localStorage.getItem(STORAGE_KEYS.SESSION) !== "false";
        if (active) {
          callback("SIGNED_IN", {
            user: {
              id: "mock-user-123",
              email: "demo@botnoi.ai",
              user_metadata: { role: "admin" }
            }
          });
        }
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    async signInWithPassword({ email }: any) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SESSION, "true");
      }
      return {
        data: {
          session: {
            user: {
              id: "mock-user-123",
              email: email || "demo@botnoi.ai",
              user_metadata: { role: "admin" }
            }
          }
        },
        error: null
      };
    },
    async signOut() {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SESSION, "false");
        localStorage.removeItem("ran-lung-get-guest");
      }
      return { error: null };
    }
  },
  from(tableName: string) {
    return new MockQueryBuilder(tableName);
  },
  channel(name: string) {
    return new MockChannel(name);
  },
  removeChannel(ch: any) {
    if (ch && typeof ch.unsubscribe === "function") {
      ch.unsubscribe();
    }
  }
} as any;
