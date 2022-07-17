package ru.kata.spring.boot_security.demo.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @EntityGraph(attributePaths = {"roles"})
    List<User> findAll();

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findById(int id);

    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"roles"})
    Optional<User> findByFirstName(String firstName);

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);

    @Override
    @EntityGraph(attributePaths = {"roles"})
    <S extends User> S save(S entity);
}
