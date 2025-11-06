// [id] ile gelen tekil görevi güncelleme (PUT) ve silme (DELETE) işlemleri burada yapılır.

import { NextResponse, NextRequest } from "next/server"; // NextRequest import'unu ekledik
import { prisma } from "@/lib/prisma"; // Prisma istemcisi

// ===================================
// DELETE İŞLEMİ (Görev Silme)
// ===================================
export async function DELETE(
  request: NextRequest, // Tip NextRequest olarak değiştirildi
  { params }: { params: { id: string } } // ID'yi direkt alıyoruz
) {
  const taskId = params.id;

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

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
// ====================================
export async function PUT(
  request: NextRequest, // Tip NextRequest olarak değiştirildi
  { params }: { params: { id: string } } // ID'yi direkt alıyoruz
) {
  const taskId = params.id;

  try {
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    const dataToUpdate: { [key: string]: any } = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (status !== undefined) dataToUpdate.status = status;
    if (priority !== undefined) dataToUpdate.priority = priority;
    
    if (dueDate !== undefined) {
        dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "Güncellenecek veri bulunamadı." },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTask, { status: 200 }); // 200 OK
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json(
      { error: "Görev güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

