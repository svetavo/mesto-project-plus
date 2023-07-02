
export const userErrors = (err, req, res, next) => {
  res.status(500).send({ message: "На сервере произошла ошибка" });
  res.status(400).send({ message: "Переданы некорректные данные" });
  res.status(404).send({ message: "Пользователь не найден" });
}
