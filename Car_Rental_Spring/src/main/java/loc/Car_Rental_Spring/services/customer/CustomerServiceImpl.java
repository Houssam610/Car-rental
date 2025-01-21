package loc.Car_Rental_Spring.services.customer;

import loc.Car_Rental_Spring.dto.BookACarDto;
import loc.Car_Rental_Spring.dto.CarDto;
import loc.Car_Rental_Spring.dto.CarDtoListDto;
import loc.Car_Rental_Spring.dto.SearchCarDto;
import loc.Car_Rental_Spring.entity.BookACar;
import loc.Car_Rental_Spring.entity.Car;
import loc.Car_Rental_Spring.entity.User;
import loc.Car_Rental_Spring.enums.BookACarStatus;
import loc.Car_Rental_Spring.repository.BookACarRepository;
import loc.Car_Rental_Spring.repository.CarRepository;
import loc.Car_Rental_Spring.repository.UserRepository;
import loc.Car_Rental_Spring.services.admin.AdminServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;



@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final BookACarRepository bookACarRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomerServiceImpl.class);


    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream().map(Car::getCardto).collect(Collectors.toList());
    }

    @Override
    public boolean bookACar(BookACarDto bookACarDto) {
        Car existingCar = carRepository.findById(bookACarDto.getCarId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));
        User user = userRepository.findById(bookACarDto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        BookACar bookACar = new BookACar();
        bookACar.setCar(existingCar);
        bookACar.setUser(user);
        bookACar.setBookACarStatus(BookACarStatus.PENDING);

        // Conversion des dates en Instant
        Instant fromDate = Instant.parse(bookACarDto.getFromDate()); // Parse directement avec Instant
        Instant toDate = Instant.parse(bookACarDto.getToDate());

        // Définir les dates dans l'objet BookACar
        bookACar.setFromDate(fromDate);
        bookACar.setToDate(toDate);

        // Calcul de la différence en jours
        long days = ChronoUnit.DAYS.between(fromDate.atZone(ZoneId.systemDefault()), toDate.atZone(ZoneId.systemDefault()));
        bookACar.setDays(days);

        // Calcul du prix total avec BigDecimal
        BigDecimal pricePerDay = existingCar.getPrice();
        BigDecimal totalPrice = pricePerDay.multiply(BigDecimal.valueOf(days));
        bookACar.setPrice(totalPrice);

        // Enregistrer la réservation
        bookACarRepository.save(bookACar);
        return true;
    }

    @Override
    public CarDto getCarById(Long carId) {
        return carRepository.findById(carId)
                .map(Car::getCardto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));
    }

    @Override
    public List<BookACarDto> getBookingsByUserId(Long userId) {
        return bookACarRepository.findAllByUserId(userId)
                .stream()
                .map(BookACar::getBookACarDto)
                .collect(Collectors.toList());
    }

    @Override
    public CarDtoListDto searchCarnew(SearchCarDto searchCarDto) {
        logger.info("Search criteria - Brand: {}, Type: {}, Transmission: {}, Color: {}",
                searchCarDto.getBrand(), searchCarDto.getType(), searchCarDto.getTransmission(), searchCarDto.getColor());

        // Appelez la méthode searchCars du repository
        List<Car> carList = carRepository.searchCars(
                searchCarDto.getBrand(),
                searchCarDto.getType(),
                searchCarDto.getTransmission(),
                searchCarDto.getColor()
        );

        logger.info("Found cars: {}", carList);

        // Mappez les résultats en CarDto
        CarDtoListDto carDtoListDto = new CarDtoListDto();
        carDtoListDto.setCarDtoList(carList.stream().map(Car::getCardto).collect(Collectors.toList()));
        return carDtoListDto;
    }
}