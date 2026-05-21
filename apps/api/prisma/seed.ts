import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [admin, employee, customerUser] = await Promise.all(
    [
      { name: "Operations Admin", email: "admin@demo.local", role: Role.ADMIN },
      { name: "Field Employee", email: "employee@demo.local", role: Role.EMPLOYEE },
      { name: "Customer User", email: "customer@demo.local", role: Role.CUSTOMER }
    ].map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { ...user, passwordHash }
      })
    )
  );

  const customer = await prisma.customer.upsert({
    where: { email: "customer@demo.local" },
    update: { userId: customerUser.id },
    create: {
      userId: customerUser.id,
      companyName: "Customer Account A",
      email: "customer@demo.local",
      phone: "+46 70 123 45 67",
      notes: "Demo customer account. Prefers morning appointments and consolidated monthly invoicing."
    }
  });

  const services = await Promise.all(
    [
      ["Commercial Cleaning", "Recurring office cleaning and inspection.", 2490],
      ["HVAC Maintenance", "Preventive HVAC check and filter replacement.", 3890],
      ["Emergency Repair", "Priority dispatch for urgent service issues.", 5290]
    ].map(([title, description, price]) =>
      prisma.service.upsert({
        where: { title: String(title) },
        update: {},
        create: { title: String(title), description: String(description), price: Number(price) }
      })
    )
  );

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      employeeId: employee.id,
      serviceId: services[0].id,
      serviceType: services[0].title,
      bookingDate: new Date(Date.now() + 86400000 * 3),
      status: "ASSIGNED",
      notes: "Bring access badge and checklist."
    }
  });

  await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      amount: services[0].price,
      status: "SENT"
    }
  });

  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: "SYSTEM",
      message: "Seed data loaded for the demo workspace."
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
