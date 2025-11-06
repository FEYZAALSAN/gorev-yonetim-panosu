// Bu dosya, /api/tasks adresine gelen GET (Listeleme) ve POST (Ekleme) isteklerini işler.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma istemcisi

// ===================================
// GET İŞLEMİ (Tüm görevleri listeleme)
// ===================================
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc', // En son eklenen görevler en üstte listelenir
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: "Görevler getirilirken hata oluştu." },
      { status: 500 } // Sunucu hatası
    );
  }
}

// ======================================
// POST İŞLEMİ (Yeni görev ekleme - CREATE)
// ======================================
export async function POST(request: Request) {
  try {
    // 1. İsteğin gövdesinden (body) gelen veriyi okuyup JSON'a çeviriyoruz
    const body = await request.json();
    
    // Gerekli alanları body'den çıkarıyoruz
    const { title, description, status, priority, dueDate } = body;

    // 2. Zorunlu alan kontrolü
    if (!title) {
      return NextResponse.json(
        { error: "Görev başlığı (title) zorunludur." },
        { status: 400 } // Hatalı İstek
      );
    }

    // 3. Prisma'yı kullanarak yeni bir görev (Task) oluşturuyoruz
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "Bekleyen",   // Varsayılan
        priority: priority || "Düşük",  // Varsayılan
        dueDate: dueDate ? new Date(dueDate) : null, // Tarih (opsiyonel)
      },
    });

    // 4. Başarılı yanıt (oluşturulan görevi döndürüyoruz)
    return NextResponse.json(newTask, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json(
      { error: "Yeni görev oluşturulurken hata oluştu." },
      { status: 500 } // Sunucu hatası
    );
  }
}