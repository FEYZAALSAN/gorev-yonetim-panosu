// [id] ile gelen tekil görevi güncelleme (PUT) ve silme (DELETE) işlemleri burada yapılır.

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma istemcisi

// ===================================
// DELETE İŞLEMİ (Görev Silme)
// URL: DELETE /api/tasks/[id]
// ===================================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } } // URL'den gelen ID'yi yakalar
) {
  const taskId = params.id;

  try {
    // 1. Prisma ile ID'ye göre görevi silme
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    // 2. Başarılı yanıt
    // Silinen görevi döndürürsek frontend'de state güncellemesi kolaylaşır.
    return NextResponse.json(deletedTask, { status: 200 }); 
  } catch (error) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json(
      { error: "Görev silinirken bir hata oluştu. ID kontrol edin." },
      { status: 500 }
    );
  }
}

// ====================================
// PUT İŞLEMİ (Görev Güncelleme - UPDATE)
// URL: PUT /api/tasks/[id]
// ====================================
export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // URL'den gelen ID
) {
  const taskId = params.id;

  try {
    // 1. İsteğin gövdesinden güncellenecek veriyi al
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    // 2. Güncelleme için sadece geçerli alanları içeren bir nesne oluştur
    const dataToUpdate: { [key: string]: any } = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (status !== undefined) dataToUpdate.status = status;
    if (priority !== undefined) dataToUpdate.priority = priority;
    
    // Tarih alanı için özel kontrol
    if (dueDate !== undefined) {
        dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
    }

    // Eğer güncellenecek veri yoksa hata döndür
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "Güncellenecek veri bulunamadı." },
        { status: 400 }
      );
    }

    // 3. Prisma ile görevi güncelle
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: dataToUpdate,
    });

    // 4. Başarılı yanıt (güncellenen görevi döndür)
    return NextResponse.json(updatedTask, { status: 200 }); // 200 OK
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json(
      { error: "Görev güncellenirken bir hata oluştu. ID kontrol edin." },
      { status: 500 }
    );
  }
}


